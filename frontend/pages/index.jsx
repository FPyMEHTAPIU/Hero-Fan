import {useRouter} from 'next/router'
import {useEffect} from "react";

const Page = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/1');
    }, []);
}

export async function getServerSideProps() {
    return {
        redirect: {
            destination: '/1',
            permanent: true,
        },
    };
}

export default Page;