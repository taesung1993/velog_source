import { DefaultLayout } from "@/components/Layouts/Default";

export default function Me() {
  return (
    <div className="flex-1">
      <h1>USER ME</h1>
    </div>
  );
}

Me.getLayout = (page: React.ReactElement) => {
  return <DefaultLayout>{page}</DefaultLayout>;
};
