import Navbar from "../navbar";

export default function BaseLayout(props: Readonly<React.PropsWithChildren>) {
   return (
      <main className="flex flex-col items-center justify-center max-w-4xl w-full mx-auto p-4 lg:pt-24">
         <div className="flex w-full flex-col">
            <Navbar />
            {props.children}
         </div>
      </main>
   )
}