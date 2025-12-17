---
sidebar_position: 9
---

# Kafka

## With out Kafka broker

- Tightly coupled architecture
  - Tiight coupling : Each service directly calls the other
  - Synchronous Execution : Services operate in a linear, step by step manner
  - Single points of Failure:

## What is kafka

kafka is a highly scalable system for managing event logs

**Event** - An event records the fact that something happened , also called record or message

When you read or write data to Kafka, you do this in the form of events

### Main Concepts

- Producers
  - Producers are those services that publish events to Kafka
- Topics
  - Events are organized and durably stored in topics
  - Topics are categories or feed names to which records are published
- Consumers
  - Consumer are those that subscribe to read and process the events sent by producers

### Real time Processing (Streams)

- Think of a stream as an continous real time flow of records
- you dont need to explicitly request new records, you just receive them
- Tranforming the input stream into output streams

### Partitions

- Scalability : Dsitributes data across multiple Kafka brokers
- Paralellism : Allow concurrent message processing
- Ordering: Guarantess order within a partition
- Fault Tolerance: Replication and leader failover
- Legal Grouping: Groups related data for efficient processing

### Consumer Groups
