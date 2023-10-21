import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.echo.useQuery({ fullName: "from tRPC Tulio" });
  const { data, refetch } = api.post.findAll.useQuery();

  const { mutate } = api.post.createQuote.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: mutateDelete } = api.post.deleteQuote.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateQuote = async () => {
    const quote = prompt("What is your quote?");
    if (quote) {
      await mutate({ quote });
    }
  };

  const handleDelete = async (id: number) => {
    await mutateDelete({ id });
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Meu SaaS
          </h1>
          <button type="button" onClick={handleCreateQuote}>
            CreateQuote
          </button>
          <ul className="text-white">
            {data?.map((quote) => {
              return (
                <li key={quote.id}>
                  {quote.quote}{" "}
                  <button type="button" onClick={() => handleDelete(quote.id)}>
                    x
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.saas : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.post.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
