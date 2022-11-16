import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../styles.module.css";

enum Mode {
  COSINE = "Cosine",
  DOT = "DOT",
}

const fs = require("fs");

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const imgArr: any = [];
  const router = useRouter();

  const readfile = async () => {
    var loc = process.cwd();

    const file = await fs.promises.readdir(
      `${loc}/public/${slug}`,
      (err, files) => {
        imgArr.push([...files]);
        return files;
      }
    );

    return file;
  };

  const result = await readfile();

  return {
    props: {
      imgArr: result.map((item) => {
        return {
          video: slug,
          link: `/0/${item}`,
          id: (item as string).replace(".jpeg", ""),
        };
      }),
    },
  };
};

export default function Home({ imgArr }) {
  const router = useRouter();
  const [mode, setMode] = useState(Mode.DOT);

  const [imgSource, setImgSource] = useState(imgArr);

  useEffect(() => {
    document.querySelector(`#hellworld${router.query.frame}`)?.scrollIntoView();
  }, [router]);

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["img-view"]}>
        {imgSource.map((e) => (
          <div key={e.link} className={styles["img-item"]}>
            <img
              id={"hellworld" + e.id}
              className={styles["img-content"]}
              src={e.link}
              alt="aic-img"
            />
            <h4
              className={styles["img-title"]}
              style={{ color: e.id === router.query.frame ? "red" : "black" }}
            >
              {e.video}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
