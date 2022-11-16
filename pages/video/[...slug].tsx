/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImgType } from "..";
import styles from "../styles.module.css";

enum Mode {
  COSINE = "Cosine",
  DOT = "DOT",
}

const fs = require("fs");

export const getStaticProps = async ({ params }: any) => {
  const { slug } = params;

  const readfile = async () => {
    var loc = process.cwd();
    try {
      const file = await fs.promises.readdir(`${loc}/public/${slug}`);
      return file.map((item: string) => ({
        video: slug,
        link: `/${slug}/${item}`,
        id: (item as string).replace(".jpeg", ""),
      }));
    } catch (e) {
      return [];
    }
  };

  const result = await readfile();

  return {
    props: {
      imgArr: result,
    },
  };
};

const PREFIX = "app_prefix";

export default function Home({ imgArr }: { imgArr: ImgType[] }) {
  const router = useRouter();

  const [imgSource, setImgSource] = useState<ImgType[]>(imgArr);

  useEffect(() => {
    document.querySelector(`#${PREFIX}${router.query.frame}`)?.scrollIntoView();
  }, [router]);

  console.log(process.cwd());

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["img-view"]}>
        {imgSource.length > 0 ? (
          imgSource.map((e: ImgType) => (
            <div key={e.link} className={styles["img-item"]}>
              <img
                id={`${PREFIX}${e.id}`}
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
          ))
        ) : (
          <div style={{ textAlign: "center" }}>No data</div>
        )}
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
