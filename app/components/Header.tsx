import Link from 'next/link'
import Nav from './Nav'
import Carousal from './carousal'

export default function Header() {
    return (
        <>
            <h1 className="text-3xl text-center font-bold">About Us</h1>
            <Carousal></Carousal>
        </>
    )
}
