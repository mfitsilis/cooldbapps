/set path to csv files
path:"C:/Users/mfitsilis/Documents/mysite/cooldbapps/ciafb/"
tpath:{`$concat(":../../";3_path;x)}

fb_appendices:("dISS"; enlist ";") 0: tpath "fb_appendices.csv"
fb_appendixcells:("dIIIISI"; enlist ";") 0: tpath "fb_appendixcells.csv"
fb_appendixtables:("dIIISI"; enlist ";") 0: tpath "fb_appendixtables.csv"
fb_categories:("dISS"; enlist ";") 0: tpath "fb_categories.csv"
fb_countries:("dIISSSdIII"; enlist ";") 0: tpath "fb_countries.csv"
fb_countryaliases:("dIIS"; enlist ";") 0: tpath "fb_countryaliases.csv"
fb_definitions:("dISS"; enlist ";") 0: tpath "fb_definitions.csv"
fb_faq:("dISSS"; enlist ";") 0: tpath "fb_faq.csv"
fb_fields:("dIISSSISI"; enlist ";") 0: tpath "fb_fields.csv"
fb_news:("dIdS"; enlist ";") 0: tpath "fb_news.csv"
fb_ranks:("dIISSddIF"; enlist ";") 0: tpath "fb_ranks.csv"
fb_regions:("dISSS"; enlist ";") 0: tpath "fb_regions.csv"
fb_versions:("dI"; enlist ";") 0: tpath "fb_versions.csv"
fb_values:("dIIIS"; enlist ";") 0: tpath "fb_values.csv"
