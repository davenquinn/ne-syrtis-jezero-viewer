BIBTEX_LIBRARY:=~/Resources/Papers/library.bib

all: output/text.html

references.bib: main.md $(BIBTEX_LIBRARY)
	cat $< | scripts/find-refs > ref-list.txt
	bib-filter -k ref-list.txt $(BIBTEX_LIBRARY) $@
	rm -f ref-list.txt

output/text.html: main.md references.bib
	cat main.md \
	| pandoc \
		--section-divs \
		--csl=resources/nature.csl \
		--bibliography references.bib \
		--metadata link-citations=true \
		--filter pandoc-citeproc > $@
