using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RobotInterrogation.Models
{
    public class InterferencePattern
    {
        public InterferencePattern(int width, int height)
        {
            Width = width;
            Height = height;
            Connections = new Direction[width, height];
        }

        public int Width { get; }

        public int Height { get; }

        public Direction[,] Connections { get; }

        [Flags]
        public enum Direction
        {
            None = 0,
            North = 1 << 0,
            South = 1 << 1,
            East = 1 << 2,
            West = 1 << 3,
        }
    }
}
