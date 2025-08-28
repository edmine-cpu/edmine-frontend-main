'use client';

import React from 'react';
import ChatList from '@/components/chat/ChatList';
import { type Lang } from '@/translations';

interface ChatsPageProps {
    params: Promise<{
        lang: Lang;
    }>;
}

export default function ChatsPage({ params }: ChatsPageProps) {
    const resolvedParams = React.use(params);
    return <ChatList lang={resolvedParams.lang} />;
}
