import { Brain, Mail, MapPin, Phone, Github, Linkedin, ArrowRight } from 'lucide-react';

function Footer() {
    const footerLinks = {
        product: [
            { name: 'Chat with Meena', path: '/chat' },
            { name: 'Features', path: '/features' },
            { name: 'Documentation', path: '/docs' },
            { name: 'API Reference', path: '/api' },
        ],
        company: [
            { name: 'About Meena', path: '/about' },
            { name: 'Careers', path: '/careers' },
            { name: 'Blog', path: '/blog' },
            { name: 'Press Kit', path: '/press' },
        ],
        resources: [
            { name: 'Tutorials', path: '/tutorials' },
            { name: 'Community', path: '/community' },
            { name: 'Support', path: '/support' },
            { name: 'Status', path: '/status' },
        ],
        legal: [
            { name: 'Privacy Policy', path: '/privacy' },
            { name: 'Terms of Service', path: '/terms' },
            { name: 'Cookie Policy', path: '/cookies' },
            { name: 'Licenses', path: '/licenses' },
        ],
    };

    const socialLinks = [
        { icon: Github, href: 'https://github.com/Satyajit-69/Meena-Gpt', label: 'GitHub' },
        { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    ];

    return (
        <footer className="relative bg-[#0A0812] overflow-hidden text-sm border-t border-white/10">
            {/* ambient glow to match hero/about sections */}
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#6C5CE7] opacity-10 blur-[140px]" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 pt-20 pb-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#00D4FF]">
                                <Brain className="w-4 h-4 text-white" />
                            </span>
                            <h3 className="font-display text-2xl font-medium text-white">Meena GPT</h3>
                        </div>
                        <p className="text-white/50 mb-6 leading-relaxed">
                            A chatbot that reasons in the open — built on the Gemini API to read, think, and answer in plain language.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">satyajitsahoo28252@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">7064539367</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">Dhenkanal, Odisha</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-lg">Product</h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link, i) => (
                                <li key={i}>
                                    <a href={link.path} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all text-[#00D4FF]" />
                                        <span>{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-lg">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, i) => (
                                <li key={i}>
                                    <a href={link.path} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all text-[#00D4FF]" />
                                        <span>{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-lg">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link, i) => (
                                <li key={i}>
                                    <a href={link.path} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all text-[#00D4FF]" />
                                        <span>{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-lg">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, i) => (
                                <li key={i}>
                                    <a href={link.path} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all text-[#00D4FF]" />
                                        <span>{link.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Copyright */}
                    <p className="text-white/40 text-sm font-mono">
                        © 2026 Meena GPT. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        {socialLinks.map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                aria-label={social.label}
                                className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:text-[#0A0812] hover:bg-white hover:border-white transition-all hover:scale-110"
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;