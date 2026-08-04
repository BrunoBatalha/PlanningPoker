import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import remarkGfm from "remark-gfm";

import styles from "./ArticleBody.module.css";

function ArticleImage({
  src,
  alt,
  width = 1400,
  height = 788,
  caption,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
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
      />
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
