#!/usr/bin/perl -w

use strict;
use warnings;
use File::Copy;
use XML::LibXML;
use Image::Magick;
use XML::Simple;

sub import($);

my $IMPORT_DIR = "import/";
my $WORKING_DIR = "temp/";
my $PACKAGE_DIR = "packages/";

`rm -rf temp/*`;
`rm -rf packages/*`;


#check prequisites
my $unzip = system("unzip >> /dev/null");
if ($unzip != 0) {
	die("Missing command: 'unzip'.");
}

opendir(DIR, $IMPORT_DIR) or die("Could not open dir: $IMPORT_DIR");
my @files = grep(/\.zip$/,readdir(DIR));
closedir(DIR);


foreach my $file (@files) {

	import($file);

}


sub import($) {
	my $file = shift;
	
	if (!-d $WORKING_DIR) {
		mkdir($WORKING_DIR, 0777);
	}
	
	mkdir($WORKING_DIR . $file, 0777);	
	my $status = system("unzip -qqo $IMPORT_DIR$file mets.xml -d $WORKING_DIR$file/");
	if ($status != 0) {
		die("Error extracting mets.xml from $IMPORT_DIR$file");
	}
	
	
	my $mets = XML::LibXML->load_xml( location =>  "$WORKING_DIR$file/mets.xml");
	
	my $urn = getURN($mets);

	if (!defined($urn)) {
		die("Error: Could not determine package URN");
	}
	
	print "Importing package: $urn\n";
	
	if (!-d $PACKAGE_DIR) {
		mkdir($PACKAGE_DIR, 0777);
	}
	mkdir($PACKAGE_DIR . $urn, 0777);
	
	if (system("unzip -qqo $IMPORT_DIR$file -d $PACKAGE_DIR$urn/") != 0) {
	
		die("Error extracting package $IMPORT_DIR$file");
	
	}
	
	# Extract images from the mets package
	
	opendir(DIR, "$PACKAGE_DIR$urn/");
	my @page_files = grep(/\d+\.xml$/,readdir(DIR));
	closedir(DIR);
	
	my @imageIndex = ();
	
	for my $file (@page_files) {
	
		print "Searching images from file: $file\n";
		
		my $doc = XML::LibXML->load_xml( location =>  "$PACKAGE_DIR$urn/$file");
		
		my $page = $doc->getElementsByTagName('Page')->get_node(1);
		my $pageNumber = $page->getAttribute("PHYSICAL_IMG_NR");
		my $pageHeight = $page->getAttribute("HEIGHT");
		my $pageWidth = $page->getAttribute("WIDTH");
		
		my $path = "$PACKAGE_DIR$urn/";
		my $imageFile = $file;
		$imageFile =~ s/\.xml$/.jpg/i;
		
		
		
		foreach ($doc->getElementsByTagName('ComposedBlock')) {
		
			my $type = $_->getAttribute("TYPE");
			
			foreach ($_->getChildrenByTagName("GraphicalElement")) {
			
			
				my $x = $_->getAttribute("HPOS");
				my $y = $_->getAttribute("VPOS");
			
				my $width =  $_->getAttribute("WIDTH");
				my $height = $_->getAttribute("HEIGHT");
			
			
				my $imageName = extractImage($pageWidth, $pageHeight, $x, $y, $width, $height, $path, $imageFile);
				
				push(@imageIndex, 
				  { 'urn'=>$urn
				   ,'imagename'=>$imageName
				   ,'pageimage'=>$imageFile
				   ,'pagexml'=>$file
				   ,'pagenumber'=>$pageNumber
				   ,'x'=>$x
				   ,'y'=>$y
				   ,'width'=>$width
				   ,'height'=>$height
				  });
			}

		
		}
		
	
	}

	my $xmlWriter = new XML::Simple (NoAttr=>1, RootName=>'images', xmldecl => '<?xml version="1.0"?>');

	open (MYFILE, '>', "$PACKAGE_DIR$urn/imageIndex.xml");
 	print MYFILE  $xmlWriter->XMLout(\@imageIndex);
 	close (MYFILE); 
	
	
	
	
	
	# Create low quality versions for large images
	
	
	
	opendir(DIR, "$PACKAGE_DIR$urn/");
	my @image_files = grep(/^\d+\.jpg$/,readdir(DIR));
	closedir(DIR);
	
	
	
	for my $image (@image_files) {
	
		
		createFastImage("$PACKAGE_DIR$urn/", $image);
	
	
	}
	

}

sub getURN($) {

	my $mets = shift;

	foreach ($mets->getElementsByTagName('MARC:datafield')) {
		my $datafield = $_;
		
		my $tag = $datafield->getAttribute("tag");
		my $ind1 = $datafield->getAttribute("ind1");
		
		if ($tag == '024' && $ind1 == '7') {
		
		
			my ($a, $sf2);
			foreach ($datafield->getChildrenByTagName('MARC:subfield')) {
				
				if ( $_->getAttribute("code") eq 'a' ) {
					$a = $_->firstChild()->textContent;
				}
				if ( $_->getAttribute("code") eq '2' ) {
					$sf2 = $_->firstChild()->textContent;
				}
				
			}
			
			if ($sf2 eq 'urn') {
				return $a;
			}
		}
		
	}

	return undef;
}





sub extractImage($$$$$$$$) {
	# xml pages have different scale than the actual images, and the xml doesn't know about the scale of the image, 
	# so the xml coordinates need to be scaled to the actual image.
	
	my ($xmlPageWidth, $xmlPageHeight, $x, $y, $width, $height, $path, $file) = @_;
	
	# Images will be named after the scale in XML, not the real scale of the image. 
	# This makes it possible to request images without knowing the scaling factor
	my $outname = "IMG-$x-$y-$width-$height-$file";

	my $image = Image::Magick->new;
	my ($imageWidth, $imageHeight) = $image->Ping($path . $file);

	
	my $widthScale = $imageWidth / $xmlPageWidth;
	my $heightScale = $imageHeight / $xmlPageHeight;
	
	
	$x = int($x * $widthScale);
	$y = int($y * $heightScale);
	
	$width = int($width * $widthScale);
	$height = int($height * $heightScale);


	my $geometry = $width."x".$height."+$x+$y\n";
	
	my $resp = $image->Read($path . $file);
	warn "$resp" if "$resp";
	$resp = $image->Crop(geometry=>$geometry);
	warn "$resp" if "$resp";
	$resp = $image->Write($path.$outname);
	warn "$resp" if "$resp";
	print "Extracted $outname\n";
	
	return $outname;
}




sub createFastImage($$) {

	my ($path, $file) = @_;
	
	print "Creating small version for $file\n";
	
	my $image = Image::Magick->new;
	$image->Read($path . $file);
    $image->Set(units=>'PixelsPerInch');
    $image->Set(density=>500);
    $image->Resample(density=>100,
                     filter=>'Lanczos',
                     blur=>0.5);
    $image->Set(depth=>8);
    $image->Write(filename=>$path."small-".$file);
        
 

}



























