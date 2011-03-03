#!/usr/bin/perl

use Switch;
use MIME::Base64;
use CGI;
use JSON;

$json = JSON->new->allow_nonref->utf8->pretty;

my $q = CGI->new;

$scaleWidth = $q->param('scaleWidth');
$scaleHeight = $q->param('scaleHeight');

$top = $q->param('top');
$left = $q->param('left');

$width = $q->param('width');
$height = $q->param('height');

$infile= $q->param('file');


if (!defined($infile) || !defined($top) || !defined($left) || !defined($width) || !defined($height)
 || !defined($scaleWidth) || !defined($scaleHeight) ) {
	print $q->header('application/json');
	print $json->encode("error");
	exit;
}




$imageWidth = int($width * $scaleWidth);
$imageHeight = int($height * $scaleHeight);

$top = int($top * $scaleHeight);
$left = int($left * $scaleWidth);

$imageSizeString = ($top + $imageWidth) ."x". ($left + $imageHeight);


$x0 = $top;
$y0 = $left;
$x1 = $x0 + $imageWidth;
$y1 = $y0 + $imageHeight;


$tempname = "temp-$x0-$y0-$x1-$y1-$infile";
$outname = "IMG-$x0-$y0-$x1-$y1-$infile";



push(@drawCommands, "-draw \"rectangle $x0,$y0 $x1,$y1\"");

$str = join(' ', @drawCommands);

	print STDERR "convert -size $imageSizeString xc:none -fill $infile $str $tempname";
	
print STDERR `convert -size $imageSizeString xc:none -fill $infile $str $tempname`;

`convert $tempname -trim $outname`;
unlink($tempname);


{
  local $/=undef;
  open FILE, $outname or die "Couldn't open file: $!";
  binmode FILE;
  $$base64image = <FILE>;
  close FILE;
}



print STDERR $base64image;
$base64image = encode_base64($$base64image);

print $q->header('application/json');

print $json->encode({image => $base64image});



