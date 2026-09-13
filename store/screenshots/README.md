# App Store screenshots

Apple accepts only exact pixel sizes and will not scale for you. For an iPhone-only, landscape
app the required set is **6.9" iPhone, landscape: 2796 x 1290** (1320 x 2868 portrait-equivalent
is also accepted). One screenshot is the minimum, ten the maximum.

Capture them on the phone from the TestFlight build — side button + volume up — not from
`expo start --web`. A browser viewport is the wrong resolution and is not the app running on the
device, which is what Apple asks for. The first pass here was 1280 x 590 from a browser; upscaling
that to 2796 x 1290 is a 2.18x blow-up and the large score numerals go soft.

A capture from any recent iPhone is close enough in aspect that resizing to 2796 x 1290 is
imperceptible (an iPhone 15 at 2556 x 1179 is a 1.09x upscale).

This folder is deliberately outside `assets/`, so the images are never pulled into the app bundle.
