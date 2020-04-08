namespace RobotInterrogation.Models
{
    public enum InterviewStatus
    {
        WaitingForConnections,
        SelectingPositions,

        SelectingPenalty_Interviewer,
        SelectingPenalty_Suspect,
        CalibratingPenalty,

        SelectingPacket,

        SelectingSuspectBackground,

        ReadyToStart,

        InProgress,

        Finished,
    }
}