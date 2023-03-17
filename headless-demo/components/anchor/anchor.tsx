type Props = {
  href: string;
  target: string;
  html: string;
};

export const Anchor: React.FC<Props> = ({ href, target, html }) => {
  // if target { return <a> ...}
  // else { return <Link> ...}
  return (
    <a
      href={href?.replace(process.env.NEXT_CMS_API_BASE_URL, "")}
      target={target}
      dangerouslySetInnerHTML={{
          __html: html
      }}
    />
  );
};
