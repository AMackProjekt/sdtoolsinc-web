/**
 * Generate a platform-compatible 1200x630 PNG social preview from the
 * official logo's embedded WebP artwork. Run as npm prebuild so the PNG
 * exists before Next.js gathers public static assets.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const logoSource = path.join(root, "public/logos/tools-inc-crown-official.svg");
const outDir = path.join(root, "public/seo");
const output = path.join(outDir, "tools-social-preview.png");

async function main() {
  const svg = fs.readFileSync(logoSource, "utf8");
  const data = svg.match(/href="data:image\/webp;base64,([^"]+)"/);
  if (!data) throw new Error("Official logo WebP data not found: cannot build social preview");
  fs.mkdirSync(outDir, { recursive: true });
  const logo = await sharp(Buffer.from(data[1], "base64"))
    .resize(340, 340, { fit: "contain" })
    .png()
    .toBuffer();

  const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#081225"/><stop offset="100%" stop-color="#143556"/></linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="30" y="30" width="1140" height="570" rx="38" fill="none" stroke="#D9A92A" stroke-opacity=".65" stroke-width="3"/>
    <path d="M410 150H1120" stroke="#38BDF8" stroke-width="3" opacity=".75"/>
    <text x="420" y="242" font-family="Arial,sans-serif" font-size="70" font-weight="900" fill="#F3CB4F">T.O.O.L.S. INC.</text>
    <text x="424" y="293" font-family="Arial,sans-serif" font-size="24" fill="#E5E7EB">Together Overcoming Obstacles &amp; Limitations</text>
    <text x="424" y="385" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#FFFFFF">Essential services. Stronger futures.</text>
    <text x="424" y="437" font-family="Arial,sans-serif" font-size="24" fill="#CFE8F8">Justice-involved individuals</text>
    <text x="424" y="471" font-family="Arial,sans-serif" font-size="24" fill="#CFE8F8">Displaced veterans &amp; community members</text>
    <text x="424" y="539" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#F3CB4F">sdtoolsinc.org</text>
  </svg>`);
  await sharp(background).composite([{ input: logo, left: 48, top: 146 }]).png().toFile(output);
  process.stdout.write("Generated public/seo/tools-social-preview.png\n");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
