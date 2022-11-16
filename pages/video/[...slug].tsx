/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ImgType } from "..";
import styles from "../styles.module.css";

const fs = require("fs");

export let BASE_FOLDER = "";

const trimFile = (str: string) => {
  return str.replace(/\.[^/.]+$/, "");
};

export const getStaticProps = async ({ params }: any) => {
  const { slug } = params;

  const readfile = async () => {
    var loc = process.cwd();

    try {
      const file = await fs.promises.readdir(`${loc}/public/${slug}`);
      return file.map((item: string) => ({
        video: slug,
        link: `/${slug}/${item}`,
        id: trimFile(item),
      }));
    } catch (e) {
      return [];
    }
  };

  const result = await readfile();

  return {
    props: {
      imgArr: result,
      baseUrl: process.cwd(),
    },
  };
};

const PREFIX = "app_prefix";

export default function Home({
  imgArr,
  baseUrl,
}: {
  imgArr: ImgType[];
  baseUrl: string;
}) {
  const router = useRouter();

  const [imgSource, setImgSource] = useState<ImgType[]>(imgArr);

  useEffect(() => {
    BASE_FOLDER = baseUrl;
  }, []);

  useEffect(() => {
    document.querySelector(`#${PREFIX}${router.query.frame}`)?.scrollIntoView();
  }, [router]);

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
