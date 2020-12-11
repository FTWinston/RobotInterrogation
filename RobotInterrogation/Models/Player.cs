using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RobotInterrogation.Models
{
    public class Player
    {
        public string ConnectionID { get; set; }

        public PlayerSeat Seat { get; set; }
    }
}
