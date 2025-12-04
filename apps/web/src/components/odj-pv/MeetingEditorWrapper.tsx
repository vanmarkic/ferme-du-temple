import { MeetingEditor } from './MeetingEditor';

interface MeetingEditorWrapperProps {
  meetingId: string;
}

export function MeetingEditorWrapper({ meetingId }: MeetingEditorWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 p-4 md:p-6">
      <MeetingEditor meetingId={meetingId} />
    </div>
  );
}
