Setups med iframes
-------------------------

CookiePrompter understøtter at en side kommunikerer brugerens cookie-beslutning til sider indlejrede i iframes.

Forudsætningen for at dette virker er at 

1) Man i den inderste, framede side, ved, hvilket domæne man frames ind i, og har mulighed for at skrive det i sin CookiePrompter konfiguration.

Dvs, at hvis man f.eks. skal have lagt en side fra http://domainb.dk ind i en side på http://domaina.dk skal man fortælle CookiePrompter på domainb.dk hvor den skal få sin cookie-info fra - at den har en parent på domaina.dk

Dette gøres ved at fortælle CookiePrompter hvilket domæne siden bliver framet ind i:
	iframeParent: 'http://domaina.dk'


EKSEMPEL
===============
Hvor http://domainb.dk/samples/domainB.html bliver lagt ind i en iframe på http://domaina.dk/samples/domainA.html
(ligger også i samples)

Den inderste side (http://domainb.dk/samples/domainB.html):

CookiePrompter.init({
	iframeParent: 'http://domaina.dk',
    trackers: [{
        name: GoogleAnalyticsTracker,
        config: {
            account: '1234'
        }
    }]
});

Den yderste side (http://domaina.dk/samples/domainA.html):

CookiePrompter.init({
    trackers: [{
        name: GoogleAnalyticsTracker,
        config: {
            account: '1234'
        }
    }]
});
