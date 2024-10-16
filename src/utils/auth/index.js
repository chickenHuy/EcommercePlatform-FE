import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const handleLoginNavigation = (token, router) => {

    Cookies.set(process.env.NEXT_PUBLIC_JWT_NAME, token, {
        expires: 1,
        secure: true,
        path: "/",
    });

    const role = jwtDecode(token).scope;
    if (role === 'ROLE_USER') {
        router.push('/');
    }
    else if (role === 'ROLE_SELLER') {
        router.push('/vendor');
    }
    else if (role === 'ROLE_ADMIN') {
        router.push('/admin');
    }
}

export { handleLoginNavigation };