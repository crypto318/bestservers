import Link from "next/link";
import { type ServerPublic } from "~/types/Server";
import ServerLink from "./Link";
import { useContext } from "react";
import { GameplayerCtx } from "@components/GamePlayer";
import { PlatformFlag } from "@prisma/client";

export default function ServerRow ({
    server
} : {
    server: ServerPublic
}) {
    const gameplayerCtx = useContext(GameplayerCtx);
    
    let joinUrl: string | undefined = undefined;

    if (server.platform?.flags.includes(PlatformFlag.A2S))
        joinUrl = `steam://connect/${server.ip}:${server.port?.toString()}`
    else if (server.platform?.flags.includes(PlatformFlag.DISCORD) && server.hostName)
        joinUrl = server.hostName;

    return (
        <div className="server-row">
            <div className="col-span-1">

            </div>
            <div className="col-span-5">
                {server.name}
            </div>
            <div className="col-span-3">
                {server.mapName}
            </div>
            <div className="col-span-1">
                <div className="flex flex-col gap-2">
                    <div>
                        {server.curUsers.toString()}/{server.maxUsers.toString()}
                    </div>
                    <div>
                        Avg {server.avgUsers.toString()}
                    </div>
                </div>
            </div>
            <div className="col-span-2 flex gap-4">
                {(server.platform?.jsInternal || server.platform?.jsExternal) && (
                    <button
                        onClick={() => {
                            if (!gameplayerCtx)
                                return;

                            gameplayerCtx.setVisible(true);

                            if (server.platform?.jsInternal)
                                gameplayerCtx.setInternal(server.platform.jsInternal);
                            else if (server.platform?.jsExternal)
                                gameplayerCtx.setExternal(server.platform.jsExternal);
                        }}
                    >Play</button>
                )}

                {joinUrl && (
                    <Link
                        href={joinUrl}
                        className="button"
                    >Join</Link>
                )}

                <ServerLink
                    server={server}
                    className="button"
                >More Info</ServerLink>
            </div>
        </div>
    );
}