export default function AuthLayout({ children }: LayoutProps<"/auth">) {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-100">{children}</div>
        </div>
    );
}
