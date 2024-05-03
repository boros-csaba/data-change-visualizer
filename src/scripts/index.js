import "../styles/styles.scss";
import { Animation } from "./animation.js";
import { initFileUploadInput } from "./file-upload.js";
import { download } from "./video.js";

const animation = new Animation();
initFileUploadInput(animation);
animation.startAnimation();

window.onload = () => {
  document
    .getElementsByClassName("download-button")[0]
    .addEventListener("click", async () => {
      let uploadUrl = await getS3PresignedUrl();
      download();
    });
};

async function getS3PresignedUrl() {
  const url = new URL(
    "https://5cf4ly6ngsvgtzjwh3xmjye6ki0hjkah.lambda-url.us-west-1.on.aws/"
  );
  let response = await fetch(url, {
    method: "POST",
  });

  return response.text();
}
