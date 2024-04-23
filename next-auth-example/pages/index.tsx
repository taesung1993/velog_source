import { DefaultLayout } from "@/components/Layouts/Default";
import { GetStaticProps } from "next";

export default function Home() {
  return (
    <div className="flex-1">
      <h1>HOME</h1>
    </div>
  );
}

Home.getLayout = (page: React.ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  };
};
