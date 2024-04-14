import { bouncy } from 'ldrs';

function Redirect() {
    bouncy.register();

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black z-50">
            <div className="flex flex-col items-center">
                <l-bouncy
                    size="45"
                    speed="1.75"
                    color="white"
                ></l-bouncy>
               <h1 className="text-white text-3sm">Redirecting you....</h1>
            </div>
        </div>
    );
}

export default Redirect;
