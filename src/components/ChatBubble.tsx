import React from 'react';
import type { Message } from '../types/geminiTypes';
import { getCurrentTime } from '../utils/getCurrentTime';
import ReactMarkdown from 'react-markdown';

interface CategoryListProps {
    msg: Message;
}

const ChatBubble: React.FC<CategoryListProps> = ({
    msg
}) => {
    switch (msg.type) {
        case "bot":
            return (

                <div className="flex md:items-start justify-center gap-4 m-3 ">
                    <img className="w-8 h-8" src="/vite-to-do-logo.png" alt="List Chat" />
                    <div className="flex flex-col w-full max-w-[250px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">List Chat</span>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{getCurrentTime()}</span>
                        </div>
                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{msg.message}</p>
                    </div>
                </div>

            );
        case 'user':
            return (

                <div className="flex md:items-start justify-center gap-4 m-3">
                    <img className="w-8 h-8 rounded-full" src="/user.jpg" alt="User" />
                    <div className="flex flex-col w-full max-w-[250px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">Você</span>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{getCurrentTime()}</span>
                        </div>
                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white"><ReactMarkdown>{msg.message}</ReactMarkdown></p>
                    </div>
                </div>

            );
        default:
            break;
    }
};

export default ChatBubble;
