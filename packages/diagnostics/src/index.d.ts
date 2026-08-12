import { DiagnosisResult, ProjectManifest } from '@devmirror/shared';
export interface LogLine {
    source?: string;
    message: string;
}
export declare class Diagnoser {
    diagnose(logs: LogLine[] | string, manifest?: ProjectManifest): DiagnosisResult;
    private extractSnippet;
}
//# sourceMappingURL=index.d.ts.map