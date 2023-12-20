const Chatbot = () => {
 return (
    <>
    <section className="flex items-center flex-col">
     <div className= "bg-white rounded-lg shadow-lg max-w-md w-full">
        <header className="bg-cyan-700 rounded-t-lg  max-w-md w-full p-6">
        <h1 className="text-slate-100">Santa</h1>
        </header>
        <div className="h-80">
        </div>
        <footer className="response border-2 border-slate-100 flex h-10">
         <div className = "response pl-4 pt-1">
            <h2>Response</h2>
         </div>
         <div className="icon">
         </div>
        </footer>
     </div>
    </section>
    </>
 )
};
export default Chatbot;