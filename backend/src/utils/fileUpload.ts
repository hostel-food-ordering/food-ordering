import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDirectory = "./uploads";
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory);
    }
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

export const uploadMulter = multer({ storage: storage });

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;

export const githubUpload = async (
  folder: string,
  file: any,
  branch: string
) => {
  const buffer = fs.readFileSync(file.path);

  const body = {
    branch: branch,
    message: "Added file via GitHub API",
    content: buffer.toString("base64"),
  };

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${folder}/${file.filename}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(body),
    }
  );

  fs.unlinkSync(file.path);

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody.content.download_url;
};
