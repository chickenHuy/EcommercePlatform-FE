import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const handleLoginNavigation = (token, router) => {

    Cookies.set(process.env.NEXT_PUBLIC_JWT_NAME, token, {
        expires: 1,
        secure: true,
        path: "/",
    });

    const role = jwtDecode(token).scope;
    if (role.includes('ROLE_ADMIN')) {
        router.push('/admin');
        return;
    }
    if (role.includes('ROLE_SELLER')) {
        router.push('/vendor');
        return;
    }
    if (role.includes('ROLE_USER')) {
        router.push('/');
        return;
    }
}

export { handleLoginNavigation };