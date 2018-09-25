namespace RobotInterrogation.Models
{
    public enum InterviewStatus
    {
        WaitingForConnections,
        PositionSelection,

        SelectingPenalty_Interviewer,
        SelectingPenalty_Suspect,

        SelectingPacket,

        SelectingRole,
        SelectingSuspectNote,

        ReadyToStart,

        InProgress,

        Finished,
    }
}