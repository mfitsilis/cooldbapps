# cool db apps
source  code and data to cooldbapps.com

2 instances of q are used. Instance one is readonly, allows up to 1 sec execution(somehow this doesn't seem to work?) on port 5900, loads the data tables using the script loadciafb.q and processes the queries:
 
    rlwrap ./q/ls32/q loadciafb.q -b -T 1 -p 5900

Use the following commands to restrict the executable functions by the remote user, allow up to 1000chars long queries

    allowedFns:(+;-;*;%;?;!;avg;sum;,;`id;`name;ij;xkey;=;in) / list of allowed function/ops to call (?:select,!:delete)
	checkFn:{if[not x in allowedFns;'(-3!x)," not allowed"];}
	validatePT:{if[0h=t:type x;if[(not 0h=type first x)&1=count first x;checkFn first x;];.z.s each x where 0h=type each x;];}
	.z.pg:{if[10h=type x;$[exit in parse x;;[x:parse x;validatePT x; : .Q.s $[1000<count eval x;1000#eval x;eval x] ]]] }

Start the other that will be receiving the messages on port 5901:

    rlwrap ./q/ls32/q -p 5901
    
Initialize the message table and use a timer to backup every night:
    
    msg:`time xkey ([]time:();email:();text:())
    exists:{x in key`.}
    .z.ts:{ $[1=exists `today;if[.z.D<=today;today::.z.D;mes:(get `:msg);mes,:msg;if[(count mes)<=count msg;msg::mes;save `msg] ] ;today::.z.D;]; }
    \t 300000
    
Start the app using (package.json contains all dependencies, if one is missing add it using npm install):
    
    npm start or node index.js
    
The table fieldsbycountry(~3MB) has all 183 fields for every one of the 261 entries in the countries table and was generated: 

    getbyfid:{ `id xkey delete fieldid from select by fieldid,id:countryid from delete version,id from select from fb_values where fieldid=x }
    cnames::`id xkey select id, name from fb_countries
    fnam:{`id`name`countryid,`$($)x}
    gfid:{ (fnam x) xcol cnames ij getbyfid y}
    fieldsbycountry:0!(`id`name,1_fb_fields[`name]) xcol delete countryid from (lj) over {gfid[x;x]} each 2+til 183
    
(lj) over {} each 2+til 183 conveniently left joins all available fields to the countries list.

To create the table databyfield, fieldsbycountry must be flipped(like a pivot) and the country names must be added as a header after any gaps or other symbol like ,()-' have been removed:

    dfld:(exec name from fb_fields)!1_value flip fieldsbycountry
    dff:(key dfld) ,' value dfld
    ctr:exec name from fb_countries
    ctr:{ ssr[x;"[,- ()'-]";""] } each ($) ctr
    databyfield:flip (`fields_countries,ctr)!flip 1_dff

