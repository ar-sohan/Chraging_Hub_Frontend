export default function Footer(){
    return(
        <>
            <div className="bg-gray-800 text-white w-full flex justify-around items-center font-semibold fixed bottom-0 p-4">
                <div>
                    <h1>Company Information</h1>
                    <ul>
                        <li>list item - 1</li>
                        <li>list item - 2</li>
                        <li>list item - 3</li>
                    </ul>
                </div>
                <div>
                    <h1>Copyright Information</h1>
                    <p>© 2023 Charging Hub EV All rights reserved.</p>
                </div>
                <div>
                    <h1>Social links</h1>
                    <ul>
                        <li>Social Link - 1</li>
                        <li>Social Link - 2</li>
                        <li>Social Link - 3</li>
                    </ul>
                </div>
            </div>
        </>
    )
}
