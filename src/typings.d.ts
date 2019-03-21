declare var module: NodeModule;

interface NodeModule {
    id: string;
}

declare interface StatsStatic {
    readonly REVISION: number;
    readonly dom: HTMLDivElement;
    readonly domElement: HTMLDivElement;
    
    addPanel: (id: number) => void;
    showPanel: (id: number) => void;
    begin: () => void;
    end: () => void;
    update: () => void;
    setMode: (id: number) => void;
}
