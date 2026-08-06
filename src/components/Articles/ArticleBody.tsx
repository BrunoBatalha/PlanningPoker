import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import remarkGfm from "remark-gfm";

import styles from "./ArticleBody.module.css";

function ArticleImage({
  src,
  mobileSrc,
  alt,
  width = 1400,
  height = 788,
  mobileWidth = 768,
  mobileHeight = 1120,
  caption,
}: {
  src: string;
  mobileSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  caption?: string;
}) {
  return (
    <figure className={styles.figure}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 768px"
        className={mobileSrc ? styles.desktopImage : undefined}
      />
      {mobileSrc ? (
        <Image
          src={mobileSrc}
          alt={alt}
          width={mobileWidth}
          height={mobileHeight}
          sizes="100vw"
          className={styles.mobileImage}
        />
      ) : null}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export async function ArticleBody({ source }: { source: string }) {
  const content = await MDXRemote({
    source,
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm] },
    },
    components: { ArticleImage },
  });

  return <div className={styles.content}>{content}</div>;
}
