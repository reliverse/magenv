import { envPublic } from "../src/main";

const DisplayUrl = () => {
	// @ts-expect-error
	return <div>Public URL: {envPublic.NEXT_PUBLIC_URL}</div>;
};

export default DisplayUrl;
