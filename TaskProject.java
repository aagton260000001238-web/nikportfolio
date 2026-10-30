package taskproject;

import java.util.*;
public class TaskProject {

    
    static int totalPoints = 0;
    static double balance = 0;

    static String[] historyTxnId = new String[100];   // transaction IDs
    static int[] historyPoints = new int[100];        // points earned
    static int historyCount = 0;                      // how many records saved

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = 0;

        while (choice != 5) {
            System.out.println("\n--- Rewards Menu ---");
            System.out.println("1. Make a deposit (test)");
            System.out.println("2. View points");
            System.out.println("3. View reward history");
            System.out.println("4. Milestone progress");
            System.out.println("5. Exit");
            System.out.print("Choice: ");
            choice = sc.nextInt();

            if (choice == 1) {
                System.out.print("Transaction ID: ");
                String txnId = sc.next();
                System.out.print("Deposit amount: ");
                double amount = sc.nextDouble();
                balance = balance + amount;
                awardPoints(txnId, amount);
            } else if (choice == 2) {
                System.out.println("Your points: " + totalPoints);
            } else if (choice == 3) {
                viewHistory();
            } else if (choice == 4) {
                showMilestone();
            } else if (choice == 5) {
                System.out.println("Goodbye!");
            } else {
                System.out.println("Invalid choice.");
            }
        }
    }

    
    static void awardPoints(String txnId, double amount) {
        // Already rewarded?
        for (int i = 0; i < historyCount; i++) {
            if (historyTxnId[i].equals(txnId)) {
                System.out.println("This transaction already earned points.");
                return;
            }
        }

        
        if (amount < 100) {
            System.out.println("Deposit must be at least 100 to earn points.");
            return;
        }

        
        int points = (int) (amount / 100);

        
        historyTxnId[historyCount] = txnId;
        historyPoints[historyCount] = points;
        historyCount++;
        totalPoints = totalPoints + points;

        System.out.println("You earned " + points + " points!");
    }

    static void viewHistory() {
        if (historyCount == 0) {
            System.out.println("No rewards yet.");
            return;
        }
        for (int i = 0; i < historyCount; i++) {
            System.out.println(historyTxnId[i] + " : +" + historyPoints[i] + " points");
        }
    }

    static void showMilestone() {
        System.out.println("Current balance: " + balance);
        if (balance < 5000) {
            System.out.println("Next milestone: 5000 (" + (5000 - balance) + " to go)");
        } else if (balance < 10000) {
            System.out.println("Next milestone: 10000 (" + (10000 - balance) + " to go)");
        } else if (balance < 25000) {
            System.out.println("Next milestone: 25000 (" + (25000 - balance) + " to go)");
        } else {
            System.out.println("All milestones reached!");
        }
    }
}
