using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Threading;

namespace TicketPurchaseSim
{
    public static class Extensions
    {
        public static async Task RemoveCompletedTasks(this List<Task> tasks, CancellationToken token)
        {
            await Task.Run(() =>
            {
                while (!token.IsCancellationRequested)
                {
                    Task[] tasksCopy = tasks.Where(t => t!=null && (t.IsCompleted || t.IsCanceled || t.IsFaulted))?.ToArray();

                    foreach (Task t in tasksCopy)
                    {
                        tasks.Remove(t);
                    }
                }
            });
            return;
        }
    }
}