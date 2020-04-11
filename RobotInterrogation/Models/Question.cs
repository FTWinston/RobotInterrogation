namespace RobotInterrogation.Models
{
    public class Question
    {
        public bool IsPrimary { get; set; }
        public string Challenge { get; set; }
        public string[] Examples { get; set; }
    }
}