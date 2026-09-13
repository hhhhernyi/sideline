# App Store screenshots

Three captures from the TestFlight build on an iPhone Pro Max, already at **2796 x 1290**, which
is Apple's required 6.9" iPhone landscape size. Upload as-is — no resizing needed.

Upload them in filename order. The App Store shows only the first one or two in search results,
so the scoreboard leads: it is the app doing its job, with real team names and the target score
visible. The picker follows to show the four sports, and the colour sheet last, since its dimmed
backdrop makes it the weakest image of the three.

## Rules worth remembering

- Apple accepts only exact pixel sizes and will not scale for you. 2796 x 1290 landscape is the
  6.9" iPhone size; one screenshot is the minimum, ten the maximum.
- Capture on the device, not from `expo start --web` — a browser viewport is the wrong resolution
  and is not the app running on a phone, which is what Apple asks for.
- **Do not send them through a chat app.** Telegram caps photos at 1280px on the long side, which
  is how the first attempt arrived as 1280 x 590 from a 2796 x 1290 original. Send as a *file*, or
  use AirDrop.

This folder sits outside `assets/`, so the images are never pulled into the app bundle.
