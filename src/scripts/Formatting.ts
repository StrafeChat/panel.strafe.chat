export class Formatting {

    public static avatar = (id: string, hash: string) => {
        if (hash) {
            const extension = hash.includes('_gif') ? '.gif' : '.png';
            return `${process.env.NEXT_PUBLIC_CDN}/avatars/${id}/${hash.replace(/(_png|_gif)$/, extension)}`
        } else return "";
    }

    public static icon = (id: string, hash: string) => {
        if (hash) {
            const extension = hash.includes('_gif') ? '.gif' : '.png';
            return `${process.env.NEXT_PUBLIC_CDN}/icons/${id}/${hash.replace(/(_png|_gif)$/, extension)}`
        } else return "";
    }

    public static censorEmail = (email: string) => {
        const atIndex = email.indexOf('@');
        const visiblePart = email.substring(0, atIndex);
        const hiddenPart = email.substring(atIndex);
    
        const censoredVisiblePart = visiblePart.substring(0, Math.min(visiblePart.length, 3)) + '*'.repeat(visiblePart.length - 3);
        return censoredVisiblePart + hiddenPart;
    }
}