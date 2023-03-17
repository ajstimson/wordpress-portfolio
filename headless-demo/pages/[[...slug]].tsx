import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Page } from "../modules/cms/page";
import { Page as PageModel } from "../modules/cms/types";
import { getPage } from "../modules/cms/api/get-page";
import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import "@fontsource/open-sans";

type Props = {
  data: PageModel;
};


const CatchAll: NextPage<Props> = ({ data }) => {
  if (!data) {
    return <>
      <div className="error-page-content">
        <div>
          <h1>
            404
          </h1>
        <div className="error-message-liner">
          <h2 className="error-message">
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
    </>;
  }

  return <Page data={data} />;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const slugParam = (context.query.slug as string[])
  const slug = slugParam ? slugParam[slugParam.length - 1] : 'front-page'
  const endpoint = 'pages';
  const data = await getPage(endpoint, slug);

  if (context.resolvedUrl === '/?utm_source=google&utm_medium=Yext'){
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    };
  }

  if (data) {
    // redirect to path if path in json does not match path in browser
    // this means the slug has a parent
    const [url] = context.resolvedUrl.replace(/\/$/, "").split("?");
    const path = data.meta.path.replace(/\/$/, "");


    if (url !== path) {
      return {
        redirect: {
          destination: path,
          permanent: true
        }
      };
    }
  }

  return {
    props: {
      data,
    },
  };
};

export default CatchAll;
