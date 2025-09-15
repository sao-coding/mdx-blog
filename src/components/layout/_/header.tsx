// import Link from "next/link";

// import Logo from "./logo";
// import { NAV_LINKS } from "@/config/menu";
// import DevicesStatus from "./devices-status";

// const Header = () => {
//   return (
//     <header className="blur-background fixed inset-x-0 top-3 z-10 mx-auto hidden h-14 max-w-6xl items-center justify-between rounded-2xl px-4 py-2 shadow-sm saturate-100 backdrop-blur-md transition-colors duration-500 md:flex">
//       <div className="flex items-center">
//         <Link href="/" className="font-bold">
//           <Logo className="h-10 fill-black stroke-[20] dark:fill-white dark:stroke-white" />
//           {/* 唯一のBlog */}
//         </Link>
//         <DevicesStatus />
//       </div>
//       <div className="flex items-center">
//         {NAV_LINKS.map((link) => (
//           <Link
//             key={link.href}
//             href={link.href}
//             title={link.text}
//             className='relative after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-0 after:rounded-full after:bg-white/70 after:transition-all after:duration-300 after:ease-in-out after:content-[""] hover:after:w-full'
//           >
//             <div className="mx-1 flex items-center justify-center">
//               <link.icon size={26} />
//               <div className="px-1">{link.text}</div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </header>
//   );
// };

// export default Header;
