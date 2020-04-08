namespace RobotInterrogation.Models
{
    public enum InterviewStatus
    {
        WaitingForConnections,
        SelectingPositions,

        SelectingPenalty_Interviewer,
        SelectingPenalty_Suspect,

        SelectingPacket,

        SelectingSuspectBackground,

        ReadyToStart,

        InProgress,

        Finished,
    }
}