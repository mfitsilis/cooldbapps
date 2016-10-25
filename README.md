# cool db apps
source  code and data to cooldbapps.com

2 instances of q are used. Instance one is readonly, allows up to 1 sec execution(somehow this doesn't seem to work?) on port 5900 and processes the queries:
 
    rlwrap ./q/ls32/q loadciafb.q -b -T 1 -p 5900

Load the data with \l loadcialb.q
Usethe following commands to restrict the executable functions by the remote user, allow up to 1000chars long queries

    allowedFns:(+;-;*;%;?;!;avg;sum;,;`id;`name;ij;xkey;=;in) / list of allowed function/ops to call (?:select,!:delete)
	checkFn:{if[not x in allowedFns;'(-3!x)," not allowed"];}
	validatePT:{if[0h=t:type x;if[(not 0h=type first x)&1=count first x;checkFn first x;];.z.s each x where 0h=type each x;];}
	.z.pg:{if[10h=type x;$[exit in parse x;;[x:parse x;validatePT x; : .Q.s $[1000<count eval x;1000#eval x;eval x] ]]] }

Start the other that will be receiving the messages on port 5901:

    rlwrap ./q/ls32/q -p 5901
    
Initialize the message table and use a timer to backup every night:
    
    msg:([]time:();email:();text:())
    exists:{x in key`.}
    .z.ts:{ $[1=exists `today;if[.z.D<=today;mes:(get `:msg);mes,:msg;if[(count msg)<=count mes;msg::mes;save `msg] ] ;today::.z.D;]; }
    \t 300000
    
Start the app using (package.json contains all dependencies, if one is missing add it using npm install):
    
    node index.js
    