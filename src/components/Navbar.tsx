import React from 'react';
import { motion } from 'motion/react';
import { Github } from 'lucide-react';
import logo from '@/assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {

    return (
        <>
            <header className='w-full fixed top-5 left-0 flex items-center justify-center z-50'>
                <motion.nav
                    transition={{ duration: 0.5, ease: "linear" }}
                    className={`w-[800px] py-4 px-7 bg-transparent`}>
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex gap-2 items-center justify-center'>
                            <img src={logo} className='w-8' alt="HearMedi Logo" />
                            <Link to={'/'} target='' className='font-oswald font-bold text-slate-950 text-2xl cursor-pointer'>HearMedi</Link>
                        </div>
                        <a target='_blank' href={"https://github.com/souravsaha5703/hear-medicine"}><Github className='text-slate-950 cursor-pointer' /></a>
                    </div>
                </motion.nav>
            </header >
        </>
    )
}

export default Navbar;