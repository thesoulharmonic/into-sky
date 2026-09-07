/* Into Sky — content model.
   Placeholder catalogue. Add more objects to `releases` / `artists` and the
   slider controls and grid layout come back automatically. */
var LOREM = {
  a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  b: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  c: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  d: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  short: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
};

window.INTO_SKY = {
  lorem: LOREM,

  releases: [
    {
      cat: "INTO-CR-0001", artist: "Caoilfhionn Rose", title: "Draw Out Your World",
      status: "Coming soon", format: "LP / CD / Digital", date: "5 February 2027",
      blurb: "Caoilfhionn Rose returns with her fourth album ‘Draw Out Your World’ - “The music was made in the moment, it’s full of improvisation and experimentation. It feels like a real celebration of collaboration and coming together through music.”",
      cover: "assets/img/covers/draw-out-your-world.jpg",
      links: [{ label: "Pre-order", href: "#", solid: true }, { label: "Listen", href: "#" }],
      sky: ["#16304f", "#7ea3c6", "#e6f4fc"]
    }
  ],

  artists: [
    { name: "Caoilfhionn Rose", tags: "", img: "assets/img/artists/caoilfhionn-rose.jpg",
      alt: "Caoilfhionn Rose photographed in profile — photograph by Emily Dennison", latest: "Draw Out Your World",
      note: "Caoilfhionn’s music is rooted in a knowledge of folk, jazz and all the twentieth century’s classic tunesmiths, and seems to create a magical, otherworldly space of her own imagining." }
  ],

  merch: [
    { name: "Vinyl",    meta: LOREM.short, price: "£00", art: "lp" },
    { name: "CD",       meta: LOREM.short, price: "£00", art: "cd" },
    { name: "T-Shirt",  meta: LOREM.short, price: "£00", art: "tee" },
    { name: "Tote Bag", meta: LOREM.short, price: "£00", art: "tote" }
  ],

  marquee: ["Caoilfhionn Rose", "Draw Out Your World"]
};
