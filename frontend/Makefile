BIBTEX_LIBRARY:=~/Resources/Papers/library.bib

REF_LIST:=text/ref-list.txt

all: text/output/main.html text/output/viewer.html

text/references.bib: text/main.md $(BIBTEX_LIBRARY)
	cat $< | text/scripts/find-refs > $(REF_LIST)
	bib-filter -k $(REF_LIST) $(BIBTEX_LIBRARY) $@
	rm -f $(REF_LIST)

text/output/%.html: text/%.md text/references.bib
	cat $< \
	| pandoc \
		--section-divs \
		--csl=text/resources/nature-doi.csl \
		--bibliography $(word 2,$^) \
		--metadata link-citations=true \
		--filter pandoc-citeproc > $@
