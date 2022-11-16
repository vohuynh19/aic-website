/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import http from "../src/axios";
import styles from "./styles.module.css";

enum Mode {
  COSINE = "cosine",
  DOT = "dot",
}

export type ImgType = {
  link: string;
  video: string;
  id: string;
};

export interface IImamge {
  frameid: string;
  video: string;
}

const URL = "http://localhost:5454/query";

export const getStaticProps = () => {
  return {
    props: {
      baseUrl: process.cwd(),
    },
  };
};

export default function Home({ baseUrl }: any) {
  const [mode, setMode] = useState(Mode.DOT);
  const router = useRouter();

  const [imgSource, setImgSource] = useState<ImgType[]>([]);

  const inputRef = useRef<any>(null);
  const secondaryRef = useRef<any>(null);

  const fetchData = async () => {
    const res = await http.post(URL, {
      method: mode,
      query: inputRef.current.value,
      top: secondaryRef.current.value,
    });

    console.log("res",res);

    const { data }: { data: IImamge[] } = res.data;

    

    setImgSource(
      data.map((item) => ({
        link: `data-compressed/${item.video}/${item.frameid}`,
        video: item.video,
        id: item.frameid.replace(".jpeg", ""),
      }))
    );
  };

  console.log(imgSource);

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["input-config"]}>
        <h1>AIC Challenger</h1>

        <input
          className={styles["input"]}
          placeholder="Please enter query here!"
          ref={inputRef}
        />
        <div className={styles["select-wrapper"]}>
          <div
            className={
              mode === Mode.COSINE
                ? styles["select-selected"]
                : styles["select-default"]
            }
            onClick={() => setMode(Mode.COSINE)}
          >
            {Mode.COSINE}
          </div>
          <div
            className={
              mode === Mode.DOT
                ? styles["select-selected"]
                : styles["select-default"]
            }
            onClick={() => setMode(Mode.DOT)}
          >
            {Mode.DOT}
          </div>
        </div>

        <input
          className={styles["input-secondary"]}
          placeholder="Please input the limit here!"
          ref={secondaryRef}
        />

        <button
          className={styles["button"]}
          onClick={() => {
            fetchData();
          }}
        >
          QUERY
        </button>
      </div>

      <div className={styles["img-view"]}>
        {imgSource.length > 0 ? (
          imgSource.map((e) => (
            <div key={e.link} className={styles["img-item"]}>
              <img
                className={styles["img-content"]}
                src={e.link}
                alt="aic-img"
                onClick={() => router.push("/video/")}
              />
              <h4 className={styles["img-title"]}>{e.video}</h4>
            </div>
          ))
        ) : (
          <img
            className={styles["no-data-img"]}
            src={"no-data.svg"}
            alt="nodata-img"
          />
        )}
      </div>
    </div>
  );
}
