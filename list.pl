#!/bin/perl

#script for creating links for the documents.

my $PACKAGE_DIR = "packages/";

opendir(DIR, $PACKAGE_DIR) or die("Could not open dir: $PACKAGE_DIR");
my @files = grep(/^[^\.]/,readdir(DIR));
closedir(DIR);

for $dir (@files) {
	print "<a href=\"viewer/?item=$dir\">$dir</a><br/>";

}
